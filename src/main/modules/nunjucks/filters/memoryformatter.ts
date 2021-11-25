export const MemoryFormatter = (value: any) => {
    value = Number(value) / (1000 * 1000);
    value = value.toFixed(2);
    return value;
}