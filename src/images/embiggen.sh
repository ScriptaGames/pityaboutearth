for sprite in *.png; do
    convert -scale 1000% $sprite big/$sprite
done
