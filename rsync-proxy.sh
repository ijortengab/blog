#!/bin/bash
dir=(log static tools)
echo '-------------------PUSH-------------------'
for (( i=0; i < ${#dir[@]} ; i++ )); do
    echo -- PUSH ${dir[$i]}
    rsync -e 'ssh -J proxy' -avr /var/www/ijortengab.id/${dir[$i]}/ ijortengab@ijortengab.id:/var/www/ijortengab.id/${dir[$i]} 
done

echo '-------------------PULL-------------------'
for (( i=0; i < ${#dir[@]} ; i++ )); do
    echo -- PULL ${dir[$i]}
    rsync -e 'ssh -J proxy' -avr ijortengab@ijortengab.id:/var/www/ijortengab.id/${dir[$i]}/ /var/www/ijortengab.id/${dir[$i]}
done
