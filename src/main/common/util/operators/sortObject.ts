
//@ts-nocheck
export class sortObject{
    static sort_by = (data, prop, isAsc) => {
        return data.sort((a, b) => {
            return (a[prop] < b[prop] ? -1 : 1) * (isAsc ? 1 : -1)
        });
    }
}

