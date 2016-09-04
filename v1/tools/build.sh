#!/usr/bin/env bash

#
# Author: leojin0701@gmail.com
# Brief:
# Arguments:
#   None
# Returns:
#   success: 0
#   fail: 1
#

# 1. Environment Variables

# 2. Source Files

# 3. Switcher
set -u

# 4. Constants
readonly BIN_GLOBAL=(
    "node"
    "npm"
    "gulp"
    "bower"
)

# 5. Variables

# 6. Functions

#######################################
# Brief:
#   Check The BinFile
# Arguments:
#   name
# Returns:
#   success: 0
#   fail: 1
#######################################
function check_bin() {
    local name="$1"
    local ret=`type $name 2>/dev/null >/dev/null && echo 0 || echo 1`
    if [ "$ret" = "0" ]; then
        return 0
    fi
    return 1
}

#######################################
# Brief:
#   Entry Init
# Arguments:
# Returns:
#######################################
function entry_init() {
    local is_env_fail=0
    echo -e "\033[34m－1－ Install Packages\033[0m"
    check_bin "npm"
    if [ "$?" = "0" ]; then
        npm install
    else
        echo -e "\033[31m'npm' Not Found\033[0m"
    fi
    echo -e "\033[34m－2－ Check Environment\033[0m"
    for module in ${BIN_GLOBAL[*]}; do
        check_bin $module
        if [ "$?" = "0" ]; then
            echo -e "$module\t\t\033[32minstalled\033[0m"
        else
            is_env_fail=1
            echo -e "$module\t\t\033[31mnot found\033[0m"
        fi
    done
    if [ "$is_env_fail" = "0" ]; then
        echo -e "\033[32mThe Environment Is OK\033[0m"
    else
        echo -e "\033[31mThe Environment Is Not OK\nGet Help From README\033[0m"
    fi
    return 0
}

#######################################
# Brief:
#   Entry Build
# Arguments:
#   buildtype
# Returns:
#######################################
function entry_build() {
    local buildtype="$1"
    local gulpfile="`dirname $0`/etc/gulpfile.js"
    gulp "build:$buildtype" --gulpfile $gulpfile
}

#######################################
# Brief:
#   Entry Help
# Arguments:
# Returns:
#######################################
function entry_help() {
    local scriptname="`dirname $0`/`basename $0`"
    cat << EOF
usage $scriptname [options] [args]
-i      init the project
-h      get Help
-b ARG  build for dev/release
EOF
}

#######################################
# Brief:
#   Main Function
# Arguments:
#   None
# Returns:
#   success: 0
#   fail: 1
#######################################
function main() {
    if [[ $# -lt 1 ]]; then
        entry_help
    fi
    while getopts "hib:" opt; do
        case $opt in
            h )
                entry_help
                ;;
            i )
                entry_init
                ;;
            b )
                entry_build $OPTARG
                ;;
            ＊ )
                ;;
        esac
        return $?
    done
}

main "$@"

exit $?
