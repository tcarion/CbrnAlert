import { Subscription } from 'rxjs';
export class SubscriptionsContainer {
    private subs: Subscription[] = [];

    set add(s: Subscription) {
        this.subs.push(s);
    }

    dispose() {
        this.subs.forEach(s => s.unsubscribe());
    }
}
