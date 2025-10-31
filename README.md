# Bash Scripting Template

A comprehensive Bash scripting template with best practices, examples, and common patterns.

## Files

- **main.sh** - Main script template with argument parsing, error handling, and structured functions
- **example.sh** - Examples demonstrating common Bash patterns and operations
- **utils.sh** - Reusable utility functions for other scripts

## Features

- ✅ Proper shebang and strict mode (`set -euo pipefail`)
- ✅ Command-line argument parsing
- ✅ Error handling and logging
- ✅ Modular function design
- ✅ Usage documentation
- ✅ Example patterns and operations

## Usage

### Main Script

```bash
# Show help
./main.sh --help

# Basic usage
./main.sh --name "Your Name"

# With verbose output
./main.sh -v --name "Your Name"

# Save output to file
./main.sh --name "Your Name" --output results.txt
```

### Examples

```bash
# Run examples
./example.sh
```

### Using Utilities

```bash
# Source utilities in your own scripts
source ./utils.sh

# Use utility functions
is_command_available "git"
validate_file "/path/to/file"
```

## Best Practices Implemented

1. **Strict Mode**: `set -euo pipefail` ensures scripts fail fast on errors
2. **Argument Parsing**: Clean handling of command-line options
3. **Error Handling**: Proper exit codes and error messages
4. **Logging**: Timestamped log messages
5. **Documentation**: Built-in help and usage information
6. **Modularity**: Reusable functions and utilities

## Script Structure

```
├── main.sh       # Main script template
├── example.sh    # Pattern examples
├── utils.sh      # Utility functions
└── README.md     # Documentation
```

## Common Patterns

### Variables
- Use `local` for function variables
- Quote variables: `"$var"` not `$var`
- Use `${var}` for clarity

### Functions
- One purpose per function
- Return meaningful exit codes
- Use `local` for all function variables

### Error Handling
- Check command success with `if`
- Use `set -e` to exit on errors
- Provide meaningful error messages

## Learn More

- [Bash Manual](https://www.gnu.org/software/bash/manual/)
- [ShellCheck](https://www.shellcheck.net/) - Script analysis tool
- [Google Shell Style Guide](https://google.github.io/styleguide/shellguide.html)
