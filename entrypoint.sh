#!/bin/sh

echo "Checking that NEXT_PUBLIC_API_URL env-var exists"
test -n "$NEXT_PUBLIC_HTTP_PROXY"
echo "Checking that NEXT_PUBLIC_SITE_NAME env-var exists"
test -n "$NEXT_PUBLIC_SITE_NAME"
echo "Checking that NEXT_PUBLIC_SITE_TITLE env-var exists"
test -n "$NEXT_PUBLIC_SITE_TITLE"
echo "Checking that NEXT_PUBLIC_SITE_DESCRIPTION env-var exists"
test -n "$NEXT_PUBLIC_SITE_DESCRIPTION"
echo "Checking that NEXT_PUBLIC_SITE_COLOR env-var exists"
test -n "$NEXT_PUBLIC_SITE_COLOR"
echo "Checking that NEXT_PUBLIC_SITE_URL env-var exists"
test -n "$NEXT_PUBLIC_SITE_URL"

echo "Ignore permission errors below"
files=$(find /app/.next \( -type d -name .git -prune \) -o -type f -print0)

$files | xargs -0 sed -i "s#APP_NEXT_PUBLIC_HTTP_PROXY#$NEXT_PUBLIC_HTTP_PROXY#g"
$files | xargs -0 sed -i "s#APP_NEXT_PUBLIC_SITE_NAME#$NEXT_PUBLIC_SITE_NAME#g"
$files | xargs -0 sed -i "s#APP_NEXT_PUBLIC_SITE_TITLE#$NEXT_PUBLIC_SITE_TITLE#g"
$files | xargs -0 sed -i "s#APP_NEXT_PUBLIC_SITE_DESCRIPTION#$NEXT_PUBLIC_SITE_DESCRIPTION#g"
$files | xargs -0 sed -i "s#APP_NEXT_PUBLIC_SITE_COLOR#$NEXT_PUBLIC_SITE_COLOR#g"
$files | xargs -0 sed -i "s#APP_NEXT_PUBLIC_SITE_URL#$NEXT_PUBLIC_SITE_URL#g"

echo "Starting NextJS"
exec "$@"
 