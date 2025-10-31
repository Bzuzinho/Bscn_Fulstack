#!/usr/bin/env bash

set -euo pipefail

echo "=== Bash Scripting Examples ==="
echo ""

echo "1. String manipulation:"
text="Hello World"
echo "   Original: $text"
echo "   Uppercase: ${text^^}"
echo "   Lowercase: ${text,,}"
echo "   Length: ${#text}"
echo ""

echo "2. Array operations:"
fruits=("apple" "banana" "cherry" "date")
echo "   All fruits: ${fruits[@]}"
echo "   First fruit: ${fruits[0]}"
echo "   Number of fruits: ${#fruits[@]}"
echo ""

echo "3. Conditional logic:"
number=42
if [[ $number -gt 40 ]]; then
    echo "   $number is greater than 40"
else
    echo "   $number is not greater than 40"
fi
echo ""

echo "4. Loop examples:"
echo "   Counting 1 to 5:"
for i in {1..5}; do
    echo "      - Count: $i"
done
echo ""

echo "5. File operations:"
temp_file=$(mktemp)
echo "Sample content" > "$temp_file"
if [[ -f "$temp_file" ]]; then
    echo "   Temporary file created: $temp_file"
    echo "   Content: $(cat "$temp_file")"
    rm "$temp_file"
    echo "   File cleaned up"
fi
echo ""

echo "6. Command substitution:"
current_date=$(date +%Y-%m-%d)
echo "   Today's date: $current_date"
echo "   Current user: $USER"
echo "   Working directory: $PWD"
echo ""

echo "=== Examples completed! ==="
