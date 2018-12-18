#!/bin/bash
rsync -e 'ssh -J proxy' -avr --delete /var/www/ijortengab.id/ ijortengab@ijortengab.id:/var/www/ijortengab.id
