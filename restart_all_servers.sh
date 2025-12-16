#!/bin/bash

# Default values
CLEAR_CACHE=false
PORT=5173

# Help function
usage() {
    echo "Usage: $0 [options]"
    echo "Restarts the development server for the project."
    echo ""
    echo "Options:"
    echo "  -c, --clear-cache    Clear the Vite cache (node_modules/.vite) before starting"
    echo "  -p, --port PORT      Specify the port to check/run on (default: 5173)"
    echo "  -h, --help           Show this help message"
    exit 1
}

# Parse command line arguments
while [[ "$#" -gt 0 ]]; do
    case $1 in
        -c|--clear-cache) CLEAR_CACHE=true ;;
        -p|--port) PORT="$2"; shift ;;
        -h|--help) usage ;;
        *) echo "Unknown parameter passed: $1"; usage ;;
    esac
    shift
done

echo "🔄 Restarting Project Servers..."

# 1. Stop existing server
echo "🔍 Checking for running server on port $PORT..."
PIDS=$(lsof -t -i:$PORT)

if [ -n "$PIDS" ]; then
    echo "🛑 Stopping process on port $PORT (PID: $PIDS)..."
    kill -9 $PIDS
    echo "✅ Server stopped."
else
    echo "ℹ️  No server found running on port $PORT."
fi

# 2. Clear cache if requested
if [ "$CLEAR_CACHE" = true ]; then
    echo "🧹 Clearing Vite cache..."
    rm -rf node_modules/.vite
    echo "✅ Cache cleared."
fi

# 3. Start server
echo "🚀 Starting development server..."
npm run dev
