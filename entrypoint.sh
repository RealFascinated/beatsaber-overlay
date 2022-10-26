#!/bin/sh

echo "Check that we have NEXT_PUBLIC_API_URL vars"
test -n "$NEXT_PUBLIC_HTTP_PROXY"
echo "Check that we have NEXT_PUBLIC_SITE_NAME vars"
test -n "$NEXT_PUBLIC_SITE_NAME"
echo "Check that we have NEXT_PUBLIC_SITE_TITLE vars"
test -n "$NEXT_PUBLIC_SITE_TITLE"
echo "Check that we have NEXT_PUBLIC_SITE_DESCRIPTION vars"
test -n "$NEXT_PUBLIC_SITE_DESCRIPTION"
echo "Check that we have NEXT_PUBLIC_SITE_COLOR vars"
test -n "$NEXT_PUBLIC_SITE_COLOR"
echo "Check that we have NEXT_PUBLIC_SITE_URL vars"
test -n "$NEXT_PUBLIC_SITE_URL"

echo find /app/.next \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 

find /app/.next \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s#APP_NEXT_PUBLIC_HTTP_PROXY#$NEXT_PUBLIC_HTTP_PROXY#g"
find /app/.next \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s#APP_NEXT_PUBLIC_SITE_NAME#$NEXT_PUBLIC_SITE_NAME#g"
find /app/.next \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s#APP_NEXT_PUBLIC_SITE_TITLE#$NEXT_PUBLIC_SITE_TITLE#g"
find /app/.next \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s#APP_NEXT_PUBLIC_SITE_DESCRIPTION#$NEXT_PUBLIC_SITE_DESCRIPTION#g"
find /app/.next \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s#APP_NEXT_PUBLIC_SITE_COLOR#$NEXT_PUBLIC_SITE_COLOR#g"
find /app/.next \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s#APP_NEXT_PUBLIC_SITE_URL#$NEXT_NEXT_PUBLIC_SITE_URL#g"

echo "Starting NextJS"
exec "$@"
