import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmDialogComponent } from "app/shared/confirm-dialog/confirm-dialog.component";
import { Observable } from "rxjs";

const ICON_MAP: Record<string, string> = {
    success: 'check',
    warning: 'exclamation',
    danger: 'times',
    info: 'info',
    question: 'question',
    default: 'thumbs-up'
};

@Injectable({ providedIn: 'root' })
export class ConfirmDialogService {
    constructor(private dialog: MatDialog) {}

    openConfirm(options: {
        title?: string;
        message?: string;
        confirmText?: string;
        cancelText?: string;
        icon?: string;
    }): Observable<boolean> {
        const displayIcon = options.icon ? ICON_MAP[options.icon!] || options.icon: ICON_MAP['default'];
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            panelClass: 'custom-dialog',
            width: '400px',
            data: {
                title: options.title,
                message: options.message,
                confirmText: options.confirmText || 'Confirm',
                cancelText: options.cancelText || 'Cancel',
                icon: displayIcon,
                color: options.icon ?? 'default'
            }
        });

        return dialogRef.afterClosed();
    };
}