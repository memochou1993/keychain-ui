#!/bin/bash

yarn build --mode production
rsync -avR --delete-after dist/* root@139.162.101.50:/var/www/keychain-client
