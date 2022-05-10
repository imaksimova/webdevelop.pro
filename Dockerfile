FROM jojomi/hugo:0.80.0

ARG BASE_URL

ENV BASE_URL=$BASE_URL

COPY . /app

WORKDIR /app

EXPOSE 8085

CMD ["hugo", "server", "--bind=0.0.0.0", "--minify", "--port=8085", "--baseURL=$BASE_URL", "--appendPort=false"]
