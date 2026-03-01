# Local Development Server

## Quick Start

Start the development server with custom 404 handling:

```bash
python3 serve.py
```

Or specify a custom port:

```bash
python3 serve.py 3000
```

## Features

- ✅ Serves all static files normally
- ✅ Returns your custom `404.html` for unknown routes (instead of default Python error page)
- ✅ Adds cache-control headers for local development
- ✅ Default port: 8000

## Testing

```bash
# Start the server
python3 serve.py

# Test normal route
curl http://localhost:8000/

# Test custom 404
curl http://localhost:8000/any-unknown-path
```

## Stop Server

Press `Ctrl+C` in the terminal running the server.
