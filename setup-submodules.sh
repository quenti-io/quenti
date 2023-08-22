#!/bin/sh

if [ $# -eq 0 ]; then
  echo "Usage: setup-submodules.sh <integrations,website>"
  exit 1
fi

if [ "$GITHUB_ACCESS_TOKEN" == "" ]; then
  echo "GITHUB_ACCESS_TOKEN is not set"
  exit 1
fi

set -e

for module in "$@"; do
  echo "Setting up submodule $module..."

  project=https://$GITHUB_ACCESS_TOKEN@github.com/quenti-io/$module

  if [ "$(git ls-remote "$project" 2>/dev/null)" ]; then
    echo "Getting '$module'..."

    git config -f .gitmodules --unset-all "submodule.packages/$module.branch"
    git submodule add --force $project "packages/$module"
    git config -f .gitmodules --add "submodule.packages/$module.branch" main

    cd packages/$module && git pull origin main && cd ../..

    git restore --staged packages/$module
  else
    echo "Missing access to '$module'"
  fi
done
