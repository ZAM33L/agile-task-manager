import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task } from '../../models/task.model';
import { ColumnComponent } from '../column/column.component';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, FormsModule, ColumnComponent],
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent {

  todoTasks: Task[] = [];

  // --------------------
  // ADD MODAL
  // --------------------
  showAddModal = false;

  newTask: Task = {
    id: 0,
    title: '',
    description: '',
    priority: 'Medium'
  };

  openAddModal() {
    this.showAddModal = true;
  }

  closeAddModal() {
    this.showAddModal = false;
  }

  addTask() {
    this.todoTasks.push({
      ...this.newTask,
      id: Date.now()
    });

    this.newTask = {
      id: 0,
      title: '',
      description: '',
      priority: 'Medium'
    };

    this.closeAddModal();
  }

  // --------------------
  // EDIT MODAL
  // --------------------
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

    const index = this.todoTasks.findIndex(
      t => t.id === this.editingTask!.id
    );

    if (index !== -1) {
      this.todoTasks[index] = { ...this.editingTask };
    }

    this.closeEditModal();
  }

  // --------------------
  // DELETE SINGLE
  // --------------------
  deleteTask(id: number) {
    this.todoTasks = this.todoTasks.filter(t => t.id !== id);
  }

  // --------------------
  // DELETE ALL
  // --------------------
  showDeleteConfirm = false;

  openDeleteConfirm() {
    this.showDeleteConfirm = true;
  }

  closeDeleteConfirm() {
    this.showDeleteConfirm = false;
  }

  confirmDelete() {
    this.todoTasks = [];
    this.closeDeleteConfirm();
  }
}
