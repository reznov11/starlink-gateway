FROM python:3.11-alpine as build

LABEL author="Ammar"

ENV TZ=Asia/Bishkek

WORKDIR /app

COPY ./requirements.txt /app

RUN mkdir -p ./static
RUN apk --no-cache update && \
    apk add --no-cache --virtual .build-deps \
        gcc \
        libc-dev \
        linux-headers \
        tzdata \
        zip \
        libmagic
RUN pip install --upgrade pip && pip install -r requirements.txt
RUN cp /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
RUN mkdir -p ./logs

FROM build as app

COPY . /app

RUN chmod +x /app/entrypoint.sh
ENTRYPOINT ["/app/entrypoint.sh"]
