FROM jojomi/hugo:0.80.0

COPY . /app

WORKDIR /app

EXPOSE 8085

CMD ["hugo", "server", "--bind=0.0.0.0", "--minify", "--port=8085", "--baseURL=https://dev2.webdevelop.pro/", "--appendPort=false"]