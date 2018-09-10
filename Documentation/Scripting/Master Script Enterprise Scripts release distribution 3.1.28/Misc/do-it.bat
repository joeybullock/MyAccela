del merged.txt

for %%I in (*.js) do (
    type %%I >> merged.tmp
    echo. >> merged.tmp
)

ren merged.tmp merged.txt