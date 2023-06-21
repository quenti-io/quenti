import { Card, Container, GridItem, Stat, StatLabel, StatNumber, useColorModeValue } from "@chakra-ui/react"
import React, { useEffect } from "react";
import { useMatchContext } from "../../stores/use-match-store";

export interface MatchStatProps {
    value: number | string;
    label: string;
}

export const MatchStat: React.FC<MatchStatProps> = ({ value, label }) => {
    const text = useColorModeValue("gray.600", "gray.400");

    return (
        <GridItem>
            <Stat>
                <StatLabel color={text} fontWeight={700}>
                    {label}
                </StatLabel>
                <StatNumber
                    fontSize={{ base: "3xl", sm: "4xl", md: "5xl" }}
                    fontFamily="Outfit"
                    fontWeight={800}
                >
                    {value}
                </StatNumber>
            </Stat>
        </GridItem>
    );
};

const MatchInfo = () => {
    let startTime = useMatchContext(s => s.roundStartTime)
    let progress = useMatchContext(s => s.roundProgress)
    let roundItems = useMatchContext(s => s.termsThisRound)
    let incorrects = useMatchContext(s => s.incorrectGuesses)
    let completed = useMatchContext(s => s.completed)

    let [seconds, setSeconds] = React.useState('0')

    useEffect(() => {
        const interval = setInterval(() => {
            setSeconds(() => ((Date.now() - startTime) / 1000).toFixed(1));
            if (completed) clearInterval(interval)
        }, 100);
        return () => clearInterval(interval);
    }, [completed]);

    return <>
        <MatchStat label="Seconds" value={seconds} />
        <MatchStat label="Progress" value={progress + '/' + roundItems} />
        <MatchStat label="Incorrects" value={incorrects} />
    </>
}

export default MatchInfo
