#!/usr/bin/env bash

is_command_available() {
    command -v "$1" >/dev/null 2>&1
}

validate_file() {
    local file=$1
    
    if [[ ! -f "$file" ]]; then
        echo "Error: File not found: $file" >&2
        return 1
    fi
    
    if [[ ! -r "$file" ]]; then
        echo "Error: File not readable: $file" >&2
        return 1
    fi
    
    return 0
}

validate_directory() {
    local dir=$1
    
    if [[ ! -d "$dir" ]]; then
        echo "Error: Directory not found: $dir" >&2
        return 1
    fi
    
    return 0
}

ask_confirmation() {
    local prompt=${1:-"Are you sure?"}
    local response
    
    read -rp "$prompt [y/N] " response
    case "$response" in
        [yY][eE][sS]|[yY])
            return 0
            ;;
        *)
            return 1
            ;;
    esac
}

get_timestamp() {
    date +%Y%m%d_%H%M%S
}

create_backup() {
    local file=$1
    local backup_file="${file}.backup.$(get_timestamp)"
    
    if [[ -f "$file" ]]; then
        cp "$file" "$backup_file"
        echo "Backup created: $backup_file"
        return 0
    else
        echo "Error: Source file not found: $file" >&2
        return 1
    fi
}

trim_string() {
    local str=$1
    echo "$str" | sed -e 's/^[[:space:]]//' -e 's/[[:space:]]$//'
}

join_array() {
    local delimiter=$1
    shift
    local first=$1
    shift
    printf %s "$first" "${@/#/$delimiter}"
}

print_separator() {
    local char=${1:-"-"}
    local width=${2:-80}
    printf '%*s\n' "$width" '' | tr ' ' "$char"
}
