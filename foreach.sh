#!/bin/bash

root=$(pwd);

for d in "$1"/*/ ; do
  cd "$d" || exit;
  echo "";
  pwd;
  echo "$2";
  echo "===============================================---------------------";
  bash -c "$2";
  cd "$root" || exit;
done