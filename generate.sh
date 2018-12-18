#!/bin/bash
rm -rf web
sculpin generate --project-dir=sculpin --env=prod --output-dir=../web
