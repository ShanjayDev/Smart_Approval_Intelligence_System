export function generateRequestNumber(): string {
    const date = new Date();
    const timestamp = date.getTime().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, '0');
    return `REQ-${date.getFullYear()}-${timestamp}-${random}`;
}

export function formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(date);
}

export function calculateApprovalMetrics(requests: any[]): any {
    const total = requests.length;
    const approved = requests.filter(
        (r) => r.status === 'approved'
    ).length;
    const rejected = requests.filter(
        (r) => r.status === 'rejected'
    ).length;
    const pending = requests.filter(
        (r) => r.status === 'pending-review'
    ).length;
    const autoApproved = requests.filter(
        (r) => r.autoApproved
    ).length;

    return {
        total,
        approved,
        rejected,
        pending,
        autoApproved,
        approvalRate:
            total > 0 ? ((approved / total) * 100).toFixed(2) : 0,
        autoApprovalRate:
            total > 0 ? ((autoApproved / total) * 100).toFixed(2) : 0,
    };
}
