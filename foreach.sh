#!/bin/bash

root=$(pwd);

for d in "$1"/*/ ; do
  cd "$d" || exit;
  echo "";
  pwd;
  echo "${*:3}";
  echo "===============================================---------------------";
  bash -c "${*:3}";
  cd "$root" || exit;
done