import { Component, OnInit, Input } from '@angular/core';
import { Bucket } from '../bucket';
import { Objective } from '../objective';
import { MatDialog } from '@angular/material';
import { EditObjectiveDialogComponent } from '../edit-objective-dialog/edit-objective-dialog.component';
import { EditBucketDialogComponent } from '../edit-bucket-dialog/edit-bucket-dialog.component';

@Component({
  selector: 'app-bucket',
  templateUrl: './bucket.component.html',
  styleUrls: ['./bucket.component.css']
})
export class BucketComponent implements OnInit {
  @Input() bucket: Bucket;
  @Input() unit: string;
  @Input() totalAllocationPercentage: number;
  @Input() globalResourcesAvailable: number;
  @Input() uncommittedTime: Map<string, number>;
  @Input() showOrderButtons: boolean;

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }

  /**
   * Resources allocated to the given bucket in this period, based on total available
   * and bucket allocation percentage.
   */
  bucketAllocation(): number {
    return this.globalResourcesAvailable * this.bucket.allocationPercentage / 100;
  }

  edit(): void {
    this.dialog.open(EditBucketDialogComponent, {
      data: {
        'bucket': this.bucket, 'okAction': 'OK', 'allowCancel': false,
        'title': 'Edit bucket "' + this.bucket.displayName + '"',
      },
    });
  }

  addObjective(): void {
    const dialogRef = this.dialog.open(EditObjectiveDialogComponent, {
      'data': {
        'objective': new Objective('', 0, []),
        'title': 'Add Objective',
        'okAction': 'Add',
        'allowCancel': true,
        'unit': this.unit,
      },
    });
    dialogRef.afterClosed().subscribe(objective => {
      if (!objective) {
        return;
      }
      this.bucket.objectives.push(objective);
    });
  }

  private objectiveIndex(objective: Objective): number {
    return this.bucket.objectives.findIndex(o => o === objective);
  }

  deleteObjective(objective: Objective): void {
    const index = this.objectiveIndex(objective);
    this.bucket.objectives.splice(index, 1);
  }

  moveObjectiveUpOne(objective: Objective): void {
    const index = this.objectiveIndex(objective);
    if (index == 0) {
      return;
    }
    this.bucket.objectives[index] = this.bucket.objectives[index - 1];
    this.bucket.objectives[index - 1] = objective;
  }

  moveObjectiveDownOne(objective: Objective): void {
    const index = this.objectiveIndex(objective);
    if (index >= this.bucket.objectives.length - 1) {
      return;
    }
    this.bucket.objectives[index] = this.bucket.objectives[index + 1];
    this.bucket.objectives[index + 1] = objective;
  }
}
