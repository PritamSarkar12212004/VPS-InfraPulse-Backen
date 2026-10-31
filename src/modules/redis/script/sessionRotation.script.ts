export const sessionRotation = `
    local raw = redis.call('GET', KEYS[1])

    if not raw then
      return 0
    end

    local session = cjson.decode(raw)

    if session.userId ~= ARGV[1] then
      return -1
    end

    if session.hashRefreshToken ~= ARGV[2] then
      return -1
    end

    session.hashRefreshToken = ARGV[3]

    redis.call(
      'SET',
      KEYS[1],
      cjson.encode(session),
      'EX',
      ARGV[4]
    )

    return 1
  `;