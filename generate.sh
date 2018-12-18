#!/bin/bash
rm -rf web
sculpin/bin/sculpin generate --project-dir=sculpin --env=prod --source-dir=../source --output-dir=../web
