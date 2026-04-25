
#!/bin/bash
SOURCE="src/assets/quickfit-logo.png"
RES_DIR="android/app/src/main/res"

# Adaptive Foreground Icons (108dp)
sips -z 108 108 "$SOURCE" --out "$RES_DIR/mipmap-mdpi/ic_launcher_foreground.png"
sips -z 162 162 "$SOURCE" --out "$RES_DIR/mipmap-hdpi/ic_launcher_foreground.png"
sips -z 216 216 "$SOURCE" --out "$RES_DIR/mipmap-xhdpi/ic_launcher_foreground.png"
sips -z 324 324 "$SOURCE" --out "$RES_DIR/mipmap-xxhdpi/ic_launcher_foreground.png"
sips -z 432 432 "$SOURCE" --out "$RES_DIR/mipmap-xxxhdpi/ic_launcher_foreground.png"

# Legacy Icons (48dp)
sips -z 48 48 "$SOURCE" --out "$RES_DIR/mipmap-mdpi/ic_launcher.png"
sips -z 48 48 "$SOURCE" --out "$RES_DIR/mipmap-mdpi/ic_launcher_round.png"

sips -z 72 72 "$SOURCE" --out "$RES_DIR/mipmap-hdpi/ic_launcher.png"
sips -z 72 72 "$SOURCE" --out "$RES_DIR/mipmap-hdpi/ic_launcher_round.png"

sips -z 96 96 "$SOURCE" --out "$RES_DIR/mipmap-xhdpi/ic_launcher.png"
sips -z 96 96 "$SOURCE" --out "$RES_DIR/mipmap-xhdpi/ic_launcher_round.png"

sips -z 144 144 "$SOURCE" --out "$RES_DIR/mipmap-xxhdpi/ic_launcher.png"
sips -z 144 144 "$SOURCE" --out "$RES_DIR/mipmap-xxhdpi/ic_launcher_round.png"

sips -z 192 192 "$SOURCE" --out "$RES_DIR/mipmap-xxxhdpi/ic_launcher.png"
sips -z 192 192 "$SOURCE" --out "$RES_DIR/mipmap-xxxhdpi/ic_launcher_round.png"

echo "Icons generated successfully!"
