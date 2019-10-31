#!/usr/bin/env bash
# mount the json file at runtime to provide hana connection params. Do not permanently add this file to your image!
# remember to change '"host" : hxehost' to the address of the hana server
docker run \
  -p 8443:8443 \
  --mount type=bind,source=/tmp/default-services.json,target=/tmp/default-services.json \
  localhost/hxe-express
