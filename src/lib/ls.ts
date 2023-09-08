export const read = (ls: Storage) => !!ls && ls.getItem('tasks');

export const update = (ls: Storage, todoList: any[]) => {
	!!ls && ls.setItem('tasks', JSON.stringify(todoList));
	todoList = JSON.parse(read(ls));
};
