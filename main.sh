#!/usr/bin/env bash

set -euo pipefail

SCRIPT_NAME=$(basename "$0")
SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)

print_usage() {
    cat << EOF
Usage: $SCRIPT_NAME [OPTIONS] [ARGUMENTS]

A template Bash script demonstrating best practices and common patterns.

OPTIONS:
    -h, --help          Show this help message
    -v, --verbose       Enable verbose output
    -o, --output FILE   Specify output file
    -n, --name NAME     Specify a name (required)

EXAMPLES:
    $SCRIPT_NAME --name "John"
    $SCRIPT_NAME -v -n "Jane" -o results.txt

EOF
}

log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $*"
}

error() {
    echo "[ERROR] $*" >&2
}

success() {
    echo "[SUCCESS] $*"
}

greet_user() {
    local name=$1
    log "Hello, $name! Welcome to the Bash scripting template."
}

process_data() {
    local input=$1
    local output=${2:-}
    
    log "Processing data: $input"
    
    if [[ -n "$output" ]]; then
        echo "Processed: $input" > "$output"
        success "Output written to: $output"
    else
        echo "Processed: $input"
    fi
}

main() {
    local verbose=false
    local output_file=""
    local user_name=""
    
    if [[ $# -eq 0 ]]; then
        print_usage
        exit 0
    fi
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                print_usage
                exit 0
                ;;
            -v|--verbose)
                verbose=true
                shift
                ;;
            -o|--output)
                if [[ $# -lt 2 ]]; then
                    error "Option $1 requires an argument"
                    print_usage
                    exit 1
                fi
                output_file="$2"
                shift 2
                ;;
            -n|--name)
                if [[ $# -lt 2 ]]; then
                    error "Option $1 requires an argument"
                    print_usage
                    exit 1
                fi
                user_name="$2"
                shift 2
                ;;
            *)
                error "Unknown option: $1"
                print_usage
                exit 1
                ;;
        esac
    done
    
    if [[ -z "$user_name" ]]; then
        error "Name is required. Use -n or --name option."
        print_usage
        exit 1
    fi
    
    if [[ "$verbose" == true ]]; then
        log "Verbose mode enabled"
        log "Script directory: $SCRIPT_DIR"
    fi
    
    greet_user "$user_name"
    process_data "$user_name" "$output_file"
    
    success "Script completed successfully!"
}

main "$@"
