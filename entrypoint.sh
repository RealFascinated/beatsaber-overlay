$'\001'!/bin/sh

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

find /app/.next \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s$'\001'APP_NEXT_PUBLIC_HTTP_PROXY$'\001'$NEXT_PUBLIC_HTTP_PROXY$'\001'g"
find /app/.next \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s$'\001'APP_NEXT_PUBLIC_SITE_NAME$'\001'$NEXT_PUBLIC_SITE_NAME$'\001'g"
find /app/.next \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s$'\001'APP_NEXT_PUBLIC_SITE_TITLE$'\001'$NEXT_PUBLIC_SITE_TITLE$'\001'g"
find /app/.next \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s$'\001'APP_NEXT_PUBLIC_SITE_DESCRIPTION$'\001'$NEXT_PUBLIC_SITE_DESCRIPTION$'\001'g"
find /app/.next \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s$'\001'APP_NEXT_PUBLIC_SITE_COLOR$'\001'$NEXT_PUBLIC_SITE_COLOR$'\001'g"
find /app/.next \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s$'\001'APP_NEXT_PUBLIC_SITE_URL$'\001'$NEXT_PUBLIC_SITE_URL$'\001'g"

echo "Starting NextJS"
exec "$@"
 