FROM golang:1.24-alpine AS build

RUN apk --no-cache add ca-certificates git

WORKDIR /app

COPY go.mod go.sum* ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags="-s -w" -o restaurants-app


FROM alpine:latest

RUN apk --no-cache add ca-certificates tzdata

ENV TZ=Asia/Almaty

WORKDIR /app

COPY --from=build /app/restaurants-app /app/
COPY static /app/static

RUN adduser -D appuser
USER appuser

EXPOSE 8085
CMD ["./restaurants-app"]