SUBMODULE_GITHUB=github.com/quenti-io/website
SUBMODULE_PATH=packages/website

if [ "$GITHUB_ACCESS_TOKEN" == "" ]; then
  echo "GITHUB_ACCESS_TOKEN is not set"
  exit 1
fi

set -e

# Get submodule commit
output=`git submodule status --recursive`
no_prefix=${output#*-}
COMMIT=${no_prefix% *}

# Create tmp directory
rm -rf tmp || true
mkdir tmp
cd tmp

# Initialize the git repo and fetch the required commit
git init
git remote add origin https://$GITHUB_ACCESS_TOKEN@$SUBMODULE_GITHUB
git fetch --depth=1 origin $COMMIT
git checkout $COMMIT

# Move tmp to the submodule path
cd ..
rm -rf tmp/.git
mv tmp/* $SUBMODULE_PATH/

# Clean up
rm -rf tmp
