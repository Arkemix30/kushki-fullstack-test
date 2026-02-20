FROM python:3.12-alpine

# Use an unprivileged user early
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Install uv by copying it from the official toolchain
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

WORKDIR /app

# Enable bytecode compilation
ENV UV_COMPILE_BYTECODE=1
# Link mode copy for unprivileged installation
ENV UV_LINK_MODE=copy

# Pre-install dependencies for caching
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-install-project --no-dev

# Copy the actual application files
COPY . .
RUN uv sync --frozen --no-dev

# Ensure executables from .venv are in path
ENV PATH="/app/.venv/bin:$PATH"

# Give permissions to our app user
RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 5000

# We use uv run to trigger our poethepoet task defined in pyproject.toml
CMD ["uv", "run", "poe", "prod"]
