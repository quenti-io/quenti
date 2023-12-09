import prisma from "@quenti/prisma";

import { clickhouse } from "./clickhouse";
import { cache } from "./redis";

const LAST_30_MINUTES = 1000 * 60 * 30;

type Activity = {
  organizationId: string;
  activeStudents: number;
  activeTeachers: number;
};

export const collectOrganizationActivity = async (orgId: string) => {
  const users = await prisma.user.findMany({
    where: {
      organizationId: orgId,
    },
    select: {
      id: true,
      type: true,
      lastSeenAt: true,
    },
  });

  const now = new Date().getTime();
  const active = users.filter(
    (u) => u.lastSeenAt.getTime() >= now - LAST_30_MINUTES,
  );

  const activeStudents = active.filter((u) => u.type === "Student").length;
  const activeTeachers = active.filter((u) => u.type === "Teacher").length;

  await cache?.set(
    `org:${orgId}:active-users`,
    activeStudents + activeTeachers,
  );
  await ingestIntoClickHouse({
    organizationId: orgId,
    activeStudents,
    activeTeachers,
  });
};

export const getOrganizationActivity = async (
  organizationId: string,
  period: "12h" | "24h" | "5d" | "14d" | "30d",
) => {
  if (!clickhouse) return;

  const buildQuery = () => {
    const start = "now()";

    if (period == "12h")
      return `
        SELECT
        activeStudents,
        activeTeachers,
        toDateTime(time) as time
        FROM OrganizationActivity
        WHERE organizationId = {id: String}
        AND time >= ${start} - INTERVAL 12 HOUR
    `;

    const groupFn =
      period == "24h"
        ? "toStartOfTenMinutes(time)"
        : period == "5d"
          ? "toStartOfHour(time)"
          : period == "14d"
            ? "toStartOfInterval(time, INTERVAL 2 HOUR)"
            : "toStartOfInterval(time, INTERVAL 6 HOUR)";

    const interval = period == "24h" ? "1 DAY" : `${period.slice(0, -1)} DAY`;

    const fillStep =
      period == "24h"
        ? "toIntervalMinute(10)"
        : period == "5d"
          ? "toIntervalHour(1)"
          : period == "14d"
            ? "toIntervalHour(2)"
            : "toIntervalHour(6)";

    return `
      SELECT
      max(activeStudents) as activeStudents,
      max(activeTeachers) as activeTeachers,
      ${groupFn} as time
      FROM OrganizationActivity
      WHERE organizationId = {id: String}
      AND time >= ${start} - INTERVAL ${interval}
      GROUP BY time
      ORDER BY time ASC WITH FILL STEP ${fillStep}
    `;
  };

  const rows = await clickhouse.query({
    query: buildQuery(),
    query_params: {
      id: organizationId,
    },
  });

  type Entry = {
    time: string;
    activeStudents: number;
    activeTeachers: number;
  };

  const result: { data: Entry[] } = await rows.json();

  const total: number =
    (await cache?.get(`org:${organizationId}:active-users`)) || 0;

  return {
    activity: result.data.map((r) => ({
      time: new Date(`${r.time} UTC`).toISOString(),
      activeStudents: r.activeStudents,
      activeTeachers: r.activeTeachers,
    })),
    total,
  };
};

const ingestIntoClickHouse = async (activity: Activity) => {
  if (!clickhouse) return;

  await clickhouse.insert({
    table: "OrganizationActivity",
    values: activity,
    format: "JSONEachRow",
  });
};
