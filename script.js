let previousSubmissions = [];
let currentEditIndex = -1;

const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
    }
});

$(document).ready(function () {
    // Set the date input to today's date
    $('#dates').val(new Date().toISOString().split('T')[0]);

    // Retrieve previous submissions from localStorage if available
    const storedSubmissions = localStorage.getItem('previousSubmissions');
    if (storedSubmissions) {
        previousSubmissions = JSON.parse(storedSubmissions);
        console.log(previousSubmissions);
        updateTodoList();
    }

    $('#todoListForm').submit(function (e) {
        e.preventDefault();
        let data = $(this).serializeArray();
        console.log(data);
        let isValid = true;

        for (let i = 0; i < data.length; i++) {
            if (data[i].value == '') {
                $(`#${data[i].name}`).css('border', '2px solid red');
                isValid = false;
            } else {
                $(`#${data[i].name}`).css('border', '2px solid black');
            }
        }

        if (!isValid) {
            Toast.fire({
                icon: 'error',
                title: 'Task not added',
                text: 'Please fill all the fields'
            });
            return;
        }

        if (currentEditIndex >= 0) {
            previousSubmissions[currentEditIndex] = data;
            currentEditIndex = -1;
        } else {
            previousSubmissions.push(data);
        }

        updateTodoList();
        $(this).trigger('reset');
    });

    function updateTodoList() {
        $('#todoList').empty();
        let htmls = '';
        $.each(previousSubmissions, function (i, v) {
            htmls += `<div class="todossss rounded-md shadow-sm bg-white p-3 flex flex-col md:flex-row md:justify-between md:items-center gap-3" data-index="${i}">
                <div class="flex items-center gap-4"><div class="font-bold">${i + 1})</div>
                <div>`;
            for (let j = 0; j < v.length; j++) {
                htmls += `<p> <span class="font-bold capitalize">${v[j].name} :</span> <span class="text-gray-500"> ${v[j].name === 'priority' ? (v[j].value == 1 ? 'Low' : v[j].value == 2 ? 'Medium' : 'High') : v[j].value} </span> </p>`;
            }
            htmls += `</div></div><div class="flex flex-row gap-2"><div class="delete cursor-pointer bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded-sm">Delete</div>`;
            htmls += `<div class="edit cursor-pointer bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded-sm">Edit</div>`;
            htmls += `</div></div>`;
        });
        $('#todoList').append(htmls);
        // Save to localStorage
        localStorage.setItem('previousSubmissions', JSON.stringify(previousSubmissions));
    }

    $(document).on('click', '.delete', function () {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                let index = $(this).parent().data('index');
                previousSubmissions.splice(index, 1);
                Toast.fire({
                    icon: 'success',
                    title: 'Task deleted',
                    text: 'Task has been deleted'
                });
                updateTodoList();
            }
        });
    });

    $(document).on('click', '.edit', function () {
        let index = $(this).closest('.todossss').data('index');
        console.log(index);
        let item = previousSubmissions[index];
        console.log(item);
        item.forEach(field => {
            console.log(field);
            $(`[name="${field.name}"]`).val(field.value);
        });
        currentEditIndex = index;
        window.scrollTo(0, 0);
    });
});
