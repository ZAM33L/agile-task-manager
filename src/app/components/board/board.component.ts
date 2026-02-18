import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OverlayModule, ConnectedPosition } from '@angular/cdk/overlay';

import { Task } from '../../models/task.model';
import { Column } from '../../models/column.model';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ColumnComponent } from '../column/column.component';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ColumnComponent,
    OverlayModule,
    ScrollingModule
  ],
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent {
  // =============================
  // COLUMNS
  // =============================
  columns: Column[] = [
    { id: 'todo', title: 'To Do', color: 'red', tasks: [] },
    { id: 'progress', title: 'In Progress', color: 'yellow', tasks: [] },
    { id: 'completed', title: 'Completed', color: 'green', tasks: [] },
    { id: 'delivered', title: 'Delivered', color: 'blue', tasks: [] }
  ];

  get connectedColumnIds(): string[] {
    return this.columns.map(c => c.id);
  }

  currentColumnId = '';

  // =============================
  // ADD MODAL
  // =============================

  showAddModal = false;

  newTask: Task = this.createEmptyTask();

  openAddModal(columnId: string) {
    this.currentColumnId = columnId;
    this.showAddModal = true;
  }

  closeAddModal() {
    this.showAddModal = false;
    this.resetNewTask();
  }

  addTask() {
    const column = this.columns.find(c => c.id === this.currentColumnId);
    if (!column) return;

    column.tasks.push({
      ...this.newTask,
      id: Date.now()
    });

    this.closeAddModal();
  }

  private createEmptyTask(): Task {
    return {
      id: 0,
      title: '',
      description: '',
      priority: 'Medium',
      dueDate: null
    };
  }

  private resetNewTask() {
    this.newTask = this.createEmptyTask();
  }

  // =============================
  // EDIT MODAL
  // =============================

  showEditModal = false;
  editingTask: Task | null = null;

  openEditModal(task: Task) {
    this.editingTask = { ...task };
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.editingTask = null;
  }

  updateTask() {
    if (!this.editingTask) return;

    for (const column of this.columns) {
      const index = column.tasks.findIndex(t => t.id === this.editingTask!.id);
      if (index !== -1) {
        column.tasks[index] = { ...this.editingTask };
        break;
      }
    }

    this.closeEditModal();
  }

  // =============================
  // DELETE SINGLE TASK
  // =============================

  showTaskDeleteConfirm = false;
  taskToDelete: { columnId: string; taskId: number } | null = null;

  openTaskDeleteConfirm(data: { columnId: string; taskId: number }) {
    this.taskToDelete = data;
    this.showTaskDeleteConfirm = true;
  }

  closeTaskDeleteConfirm() {
    this.showTaskDeleteConfirm = false;
    this.taskToDelete = null;
  }

  confirmTaskDelete() {
    if (!this.taskToDelete) return;

    const column = this.columns.find(c => c.id === this.taskToDelete!.columnId);
    if (column) {
      column.tasks = column.tasks.filter(
        task => task.id !== this.taskToDelete!.taskId
      );
    }

    this.closeTaskDeleteConfirm();
  }

  // =============================
  // DELETE ALL IN COLUMN
  // =============================

  showDeleteConfirm = false;
  deleteColumnId = '';

  openDeleteConfirm(columnId: string) {
    this.deleteColumnId = columnId;
    this.showDeleteConfirm = true;
  }

  closeDeleteConfirm() {
    this.showDeleteConfirm = false;
  }

  confirmDelete() {
    const column = this.columns.find(c => c.id === this.deleteColumnId);
    if (column) {
      column.tasks = [];
    }
    this.closeDeleteConfirm();
  }

  // =============================
  // COLUMN MENU
  // =============================

  activeMenuColumnId: string | null = null;

  toggleMenu(columnId: string) {
    this.activeMenuColumnId =
      this.activeMenuColumnId === columnId ? null : columnId;
  }

  @HostListener('document:click')
  closeMenus() {
    this.activeMenuColumnId = null;
  }

  // =============================
  // PRIORITY DROPDOWNS
  // =============================

  isAddDropdownOpen = false;
  isEditDropdownOpen = false;

  toggleAddDropdown() {
    this.isAddDropdownOpen = !this.isAddDropdownOpen;
  }

  closeAddDropdown() {
    this.isAddDropdownOpen = false;
  }

  selectAddPriority(value: 'High' | 'Medium' | 'Low') {
    this.newTask.priority = value;
    this.closeAddDropdown();
  }

  toggleEditDropdown() {
    this.isEditDropdownOpen = !this.isEditDropdownOpen;
  }

  closeEditDropdown() {
    this.isEditDropdownOpen = false;
  }

  selectEditPriority(value: 'High' | 'Medium' | 'Low') {
    if (this.editingTask) {
      this.editingTask.priority = value;
    }
    this.closeEditDropdown();
  }

  // =============================
  // DATE PICKER (CDK)
  // =============================

  isAddDateOpen = false;
  isEditDateOpen = false;

  dateOverlayPositions: ConnectedPosition[] = [
    {
      originX: 'start',
      originY: 'bottom',
      overlayX: 'start',
      overlayY: 'top'
    }
  ];

  currentMonth = new Date();

  toggleAddDate() {
    this.isAddDateOpen = !this.isAddDateOpen;
  }

  closeAddDate() {
    this.isAddDateOpen = false;
  }

  toggleEditDate() {
    this.isEditDateOpen = !this.isEditDateOpen;
  }

  closeEditDate() {
    this.isEditDateOpen = false;
  }

  selectAddDate(date: Date) {
    this.newTask.dueDate = date;
    this.closeAddDate();
  }

  selectEditDate(date: Date) {
    if (this.editingTask) {
      this.editingTask.dueDate = date;
    }
    this.closeEditDate();
  }

  getDaysInMonth(): Date[] {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    const lastDay = new Date(year, month + 1, 0).getDate();

    const days: Date[] = [];

    for (let i = 1; i <= lastDay; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  }

  nextMonth() {
    this.currentMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth() + 1,
      1
    );
  }

  previousMonth() {
    this.currentMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth() - 1,
      1
    );
  }

  nextYear() {
    this.currentMonth = new Date(
      this.currentMonth.getFullYear() + 1,
      this.currentMonth.getMonth(),
      1
    );
  }

  previousYear() {
    this.currentMonth = new Date(
      this.currentMonth.getFullYear() - 1,
      this.currentMonth.getMonth(),
      1
    );
  }

  /* ========================= */
  /* Sorting */
  /* ========================= */

  sortColumn(column: Column, field: 'priority' | 'dueDate') {
    //cloning the original order
    if (!column.originalTasks) {
      column.originalTasks = [...column.tasks];
    }
    //clicking same field -> toggle
    if (column.sortField === field) {
      column.sortDirection = column.sortDirection === 'asc' ? 'desc' : 'asc';
    }
    else {
      column.sortField = field;
      column.sortDirection = 'asc'
    }

    const direction = column.sortDirection === 'asc' ? 1 : -1;

    if (field === 'priority') {
      const priorityOrder = {
        High: 1,
        Medium: 2,
        Low: 3
      };

      column.tasks.sort((a, b) =>
        (priorityOrder[a.priority] - priorityOrder[b.priority]) * direction
      );

    }

    if (field === 'dueDate') {
      column.tasks.sort((a, b) => {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1 * direction;
        if (!b.dueDate) return -1 * direction;

        return (a.dueDate.getTime() - b.dueDate.getTime()) * direction;
      });
    }
  }

  resetColumnSort(column: Column) {
    if (column.originalTasks) {
      column.tasks = [...column.originalTasks];
    }

    column.sortField = undefined;
    column.sortDirection = undefined;
  }

  // =============================
// ADD COLUMN MODAL
// =============================

showAddColumnModal = false;

columnTitleInput = '';
columnColorInput = 'blue';
columnInsertPosition = 0;

// CDK DROPDOWNS FOR ADD COLUMN
isColumnColorOpen = false;
isColumnPositionOpen = false;


openAddColumnModal(){
  this.columnTitleInput='';
  this.columnColorInput='blue'
  this.columnInsertPosition = this.columns.length;
  this.showAddColumnModal = true
}
closeAddColumnModal(){
  this.showAddColumnModal = false;
}

toggleColumnColor() {
  this.isColumnColorOpen = !this.isColumnColorOpen;
}

closeColumnColor() {
  this.isColumnColorOpen = false;
}

toggleColumnPosition() {
  this.isColumnPositionOpen = !this.isColumnPositionOpen;
}

closeColumnPosition() {
  this.isColumnPositionOpen = false;
}

// Available colors for new columns
availableColors: { name: string; value: string }[] = [
  { name: 'Red', value: 'red' },
  { name: 'Yellow', value: 'yellow' },
  { name: 'Green', value: 'green' },
  { name: 'Blue', value: 'blue' },
  { name: 'Purple', value: 'purple' },
  { name: 'Orange', value: 'orange' },
  { name: 'Pink', value: 'pink' },
  { name: 'Teal', value: 'teal' }
];


addColumn(){
  if(!this.columnTitleInput.trim()) return;

  const newColumn:Column = {
    id:'col-'+Date.now(),
    title:this.columnTitleInput.trim(),
    color:this.columnColorInput,
    tasks:[]
  };
  this.columns.splice(this.columnInsertPosition,0,newColumn);

  this.closeAddColumnModal()
}

//delete columns

// Column delete modal state
showColumnDeleteConfirm = false;
columnToDeleteId: string | null = null;

// Trigger modal
openDeleteColumnConfirm(columnId: string) {
  this.columnToDeleteId = columnId;
  this.showColumnDeleteConfirm = true;
}

// Close modal
closeDeleteColumnConfirm() {
  this.showColumnDeleteConfirm = false;
  this.columnToDeleteId = null;
}

// Confirm deletion
confirmColumnDelete() {
  if (this.columnToDeleteId) {
    this.columns = this.columns.filter(col => col.id !== this.columnToDeleteId);
  }
  this.closeDeleteColumnConfirm();
}


}
