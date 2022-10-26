##/bin/sh

echo "Checking that NEXT_PUBLIC_API_URL env-var exists"
test -n "$NEXT_PUBLIC_HTTP_PROXY"
echo "Found $NEXT_PUBLIC_HTTP_PROXY"

echo "Checking that NEXT_PUBLIC_SITE_NAME env-var exists"
test -n "$NEXT_PUBLIC_SITE_NAME"
echo "Found $NEXT_PUBLIC_SITE_NAME"

echo "Checking that NEXT_PUBLIC_SITE_TITLE env-var exists"
test -n "$NEXT_PUBLIC_SITE_TITLE"
echo "Found $NEXT_PUBLIC_SITE_TITLE"

echo "Checking that NEXT_PUBLIC_SITE_DESCRIPTION env-var exists"
test -n "$NEXT_PUBLIC_SITE_DESCRIPTION"
echo "Found $NEXT_PUBLIC_SITE_DESCRIPTION"

echo "Checking that NEXT_PUBLIC_SITE_COLOR env-var exists"
test -n "$NEXT_PUBLIC_SITE_COLOR"
echo "Found $NEXT_PUBLIC_SITE_COLOR"

echo "Checking that NEXT_PUBLIC_SITE_URL env-var exists"
test -n "$NEXT_PUBLIC_SITE_URL"
echo "Found $NEXT_PUBLIC_SITE_URL"

echo "Updating static next env vars"

find /app/.next \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s#APP_NEXT_PUBLIC_HTTP_PROXY#$NEXT_PUBLIC_HTTP_PROXY#g"
find /app/.next \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s#APP_NEXT_PUBLIC_SITE_NAME#$NEXT_PUBLIC_SITE_NAME#g"
find /app/.next \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s#APP_NEXT_PUBLIC_SITE_TITLE#$NEXT_PUBLIC_SITE_TITLE#g"
find /app/.next \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s#APP_NEXT_PUBLIC_SITE_DESCRIPTION#$NEXT_PUBLIC_SITE_DESCRIPTION#g"
find /app/.next \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s#APP_NEXT_PUBLIC_SITE_COLOR#$NEXT_PUBLIC_SITE_COLOR#g"
find /app/.next \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s#APP_NEXT_PUBLIC_SITE_URL#$NEXT_PUBLIC_SITE_URL#g"

echo "Starting NextJS"
exec "$@"
 