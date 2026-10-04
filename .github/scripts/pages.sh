#!/usr/bin/env bash
# Usage: pages.sh <folder> [source]
# Replaces <folder> on the gh-pages branch with the contents of [source], or removes it
# when no source is given. Run from a checkout with push access.
#
# Every push rewrites gh-pages as a single parentless commit, so old reports do not pile
# up in the history that every clone of the repository downloads. The lease makes a
# concurrent publish retry instead of dropping another pull request's folder.
set -euo pipefail

folder=$1
source=${2:-}
index=$(mktemp)
source_index=$(mktemp)
export GIT_INDEX_FILE=$index
export GIT_AUTHOR_NAME="github-actions[bot]"
export GIT_AUTHOR_EMAIL="41898282+github-actions[bot]@users.noreply.github.com"
export GIT_COMMITTER_NAME=$GIT_AUTHOR_NAME GIT_COMMITTER_EMAIL=$GIT_AUTHOR_EMAIL

for attempt in 1 2 3 4 5; do
  base=$(git ls-remote origin refs/heads/gh-pages | cut -f1)
  rm -f "$index"

  if [ -n "$base" ]; then
    git fetch --quiet --depth=1 origin "$base"
    git read-tree "$base"
    git rm -r --quiet --cached --ignore-unmatch -- "$folder"
  fi

  if [ -n "$source" ]; then
    rm -f "$source_index"
    GIT_INDEX_FILE=$source_index git --work-tree="$source" add --all --force .
    git read-tree --prefix="$folder/" "$(GIT_INDEX_FILE=$source_index git write-tree)"
  fi

  # Without it, Pages runs Jekyll, which skips files whose names start with "_".
  git update-index --add --cacheinfo "100644,$(git hash-object -w --stdin </dev/null),.nojekyll"

  commit=$(git commit-tree "$(git write-tree)" -m "Update $folder")
  if git push --force-with-lease="refs/heads/gh-pages:$base" origin "$commit:refs/heads/gh-pages"; then
    exit 0
  fi
  echo "gh-pages moved during attempt $attempt; retrying"
done

exit 1
