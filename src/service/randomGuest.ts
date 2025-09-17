export const generateCreativeUsername = (): string => {
    const prefixes = ['i', 'I', 'ai', 'cyber', 'digital', 'virtual', 'tech', 'neo', 'meta'];
    const middles = ['ninja', 'wizard', 'master', 'lord', 'king', 'queen', 'hero', 'star', 'dream'];
    const suffixes = ['pro', 'max', 'prime', 'elite', 'ultra', 'xtreme', 'alpha', 'beta', 'gamma'];

    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const randomMiddle = middles[Math.floor(Math.random() * middles.length)];
    const randomSuffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    const randomNumber = Math.floor(Math.random() * 1000);

    return `${randomPrefix}${randomMiddle}${randomSuffix}${randomNumber}`;
};

export const generateRandomId = (length: number = 8): string => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return result;
}

// Usage
const id = generateRandomId();  