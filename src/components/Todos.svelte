<script lang="ts">
	import { onMount } from 'svelte';
	import { read, update } from '$lib/ls';

	let ls: Storage | null = null;
	let todoList: any[] = [];

	onMount(() => {
		typeof localStorage !== 'undefined' && (ls = localStorage);
		todoList = JSON.parse(read(ls));
	});

	let newItem = '';
	let editMode = false;
	let itemIndex: number | null = null;

	let addTask = () => {
		if (editMode) {
			todoList[itemIndex] = { text: newItem, complete: false };
		} else {
			todoList = [{ text: newItem, completed: false }, ...todoList];
		}
		update(ls, todoList);
		newItem = '';
		editMode = false;
	};

	let deleteTask = (index: number) => {
		if (editMode) {
			document.querySelector('.task-input').focus();
			return;
		}
		todoList.splice(index, 1);
		todoList = todoList;
		update(ls, todoList);
	};

	let editTask = (index: number) => {
		editMode = true;
		document.querySelector('.task-input').focus();
		newItem = todoList[index].text;
		itemIndex = index;
	};
</script>

<div class="container">
	<div class="inner-ctn">
		<form on:submit|preventDefault class="new-task">
			<div class="input-ctn">
				<input
					class="task-input"
					aria-label="enter a task"
					placeholder="add a task..."
					bind:value={newItem}
					type="text"
				/>
				<span />
			</div>
			<button
				class="enter-btn"
				aria-label={editMode ? 'Confirm Edit' : 'Add Task'}
				on:click={addTask}>{editMode ? 'Confirm Edit' : 'Add Task'}</button
			>
		</form>

		<ul role="list">
			{#each todoList as item, index}
				<li class:editing={editMode && itemIndex === index}>
					<button
						aria-label="complete task"
						class="check-btn"
						on:click={() =>
							editMode
								? document.querySelector('.task-input').focus()
								: (item.completed = !item.completed)}
						on:click={() => update(ls, todoList)}
					/>
					<svg
						class="check"
						class:checkmark={item.completed}
						width="800px"
						height="800px"
						viewBox="5 5 25 25"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
					>
						<path
							stroke="#000000"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6.5 17l6 6 13-13"
						/>
					</svg>
					<span class="item-text" class:checked={item.completed}>{item.text}</span>
					<button class="edit" on:click={() => editTask(index)}>edit</button>
					<button class="delete" on:click={() => deleteTask(index)}
						><svg
							class="x"
							width="25px"
							height="25px"
							viewBox="0 0 32 32"
							xmlns="http://www.w3.org/2000/svg"
						>
							<defs>
								<style>
									.cls-1 {
										fill: none;
										stroke: #ffffff;
										stroke-linecap: round;
										stroke-linejoin: round;
										stroke-width: 2px;
									}

									button:hover .cls-1 {
										stroke: #000000;
									}
								</style>
							</defs>
							<title>delete task</title>
							<line class="cls-1" x1="7" x2="25" y1="7" y2="25" />
							<line class="cls-1" x1="7" x2="25" y1="25" y2="7" />
						</svg></button
					>
				</li>
				<span class="divider" />
			{/each}
		</ul>
	</div>
</div>

<style lang="scss">
	button,
	input {
		font-family: inherit;
	}

	button {
		transition: box-shadow 150ms ease;

		&:active {
			box-shadow: 0 0 2px solid black;
		}

		&:focus {
			outline: 2px solid white;
		}
	}
	.container {
		width: 100%;
		padding: 1em 2em;

		@media (min-width: 80ch) {
			width: 70ch;
		}
	}

	.editing {
		background-color: rgb(167, 218, 167);

		span {
			color: rgb(102, 108, 104);
		}
	}

	.inner-ctn {
		box-shadow: -1px 1px 10px rgba(0, 0, 0, 0.162);
		background-color: rgba(202, 222, 213, 0.644);
		border: 1px solid rgb(102, 108, 104);
		border-radius: 0.5em;
		min-height: 70vh;
		padding: 2em 3em;
	}

	.divider {
		display: block;
		width: 100%;
		height: 1px;
		background-color: rgb(102, 108, 104);
		margin-block: 0.5em;
	}

	.checked {
		text-decoration: line-through;
	}

	@keyframes draw {
		to {
			stroke-dashoffset: 0;
		}
	}

	ul {
		padding: 0;
		padding-block-start: 2em;
		display: flex;
		flex-direction: column;
		gap: 0.5em;
	}

	li {
		list-style: none;
		display: flex;
		width: 100%;
		height: fit-content;
		align-items: center;
		position: relative;

		.check-btn {
			z-index: 5;
			background-color: inherit;
			width: 20px;
			height: 20px;
			flex-shrink: 0;
			border: 1px solid black;
			cursor: pointer;
		}

		.check {
			display: none;
			position: absolute;
			stroke-dasharray: 50;
			stroke-dashoffset: 50;
			width: 2em;
			height: 2em;
			animation: draw 200ms linear forwards;
		}

		.check.checkmark {
			display: block;
		}

		span {
			padding-inline: 1em 0.8em;
		}

		.edit {
			cursor: pointer;
			background: none;
			border: 1px solid rgb(102, 108, 104);
			height: 2em;
			margin-inline-end: 1em;

			&:hover {
				background-color: rgb(167, 218, 167);
			}
		}

		.delete {
			display: grid;
			place-items: center;
			cursor: pointer;
			background: rgb(102, 108, 104);
			border: 1px solid black;
			height: 2em;

			&:hover {
				background-color: rgb(226, 170, 170);
			}
		}
	}

	.item-text {
		width: 100%;
	}

	.new-task {
		display: flex;
		justify-content: space-between;
		width: 100%;
		gap: 1em;
		padding: 0.5em 0;

		.enter-btn {
			border: 1px solid rgb(102, 108, 104);
			background: inherit;
			cursor: pointer;

			&:hover {
				background-color: white;
			}
		}
	}

	.input-ctn {
		position: relative;
		flex-grow: 1;
		display: flex;

		.task-input {
			border: none;
			padding: 0.5em;
			flex-grow: 1;
			background-color: rgb(221, 233, 221);

			&:focus-within {
				outline: none;

				& ~ span {
					width: 100%;
					height: 2px;
					background-color: black;
					position: absolute;
					bottom: 0;
				}
			}
		}
	}
</style>
