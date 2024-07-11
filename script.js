let studentsData = [];

document.getElementById('filter-button').addEventListener('click', function() {
    const studentId = document.getElementById('id-filter').value.trim();
    if (studentId) {
        loadStudentData(studentId);
    } else {
        alert('请输入学号');
    }
});

document.getElementById('dropdown-button').addEventListener('click', function() {
    const dropdownMenu = document.getElementById('dropdown-menu');
    dropdownMenu.style.display = dropdownMenu.style.display === 'none' || dropdownMenu.style.display === '' ? 'block' : 'none';
    if (dropdownMenu.style.display === 'block') {
        populateDropdownMenu();
    }
});

async function loadStudentData(id) {
    try {
        const response = await fetch('data/students.xlsx');
        if (!response.ok) {
            throw new Error('Failed to fetch the Excel file');
        }

        const arrayBuffer = await response.arrayBuffer();
        const data = new Uint8Array(arrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        studentsData = XLSX.utils.sheet_to_json(worksheet);

        console.log('Loaded student data:', studentsData);

        const student = studentsData.find(student => student.学号 == id);
        if (student) {
            const imagePath = `images/${id.slice(0, 3)}/${id}.png`;  // 假设文件夹结构是 images/xxx/id.png
            document.getElementById('student-image').src = imagePath;
            document.getElementById('student-name').textContent = `姓名: ${student.姓名}`;
            document.getElementById('student-id').textContent = `学号: ${student.学号}`;
            document.getElementById('student-college').textContent = `学院: ${student.学院}`;
            document.getElementById('student-major').textContent = `专业: ${student.专业}`;
            document.getElementById('student-grade').textContent = `年级: ${student.年级}`;
        } else {
            console.warn('Student not found:', id);
            alert('未找到该学号对应的学生信息');
        }
    } catch (error) {
        console.error('Error loading student data:', error);
        alert('加载学生信息时发生错误，请检查文件路径和格式');
    }
}

function populateDropdownMenu() {
    const dropdownMenu = document.getElementById('dropdown-menu');
    dropdownMenu.innerHTML = '';
    studentsData.forEach(student => {
        const div = document.createElement('div');
        div.textContent = student.学号;
        div.addEventListener('click', function() {
            document.getElementById('id-filter').value = student.学号;
            dropdownMenu.style.display = 'none';
            loadStudentData(student.学号);
        });
        dropdownMenu.appendChild(div);
    });
}

function filterStudentIds() {
    const filterValue = document.getElementById('id-filter').value.trim();
    const dropdownMenu = document.getElementById('dropdown-menu');
    dropdownMenu.innerHTML = '';
    const filteredData = studentsData.filter(student => student.学号.startsWith(filterValue));
    filteredData.forEach(student => {
        const div = document.createElement('div');
        div.textContent = student.学号;
        div.addEventListener('click', function() {
            document.getElementById('id-filter').value = student.学号;
            dropdownMenu.style.display = 'none';
            loadStudentData(student.学号);
        });
        dropdownMenu.appendChild(div);
    });
}

// 初始化时加载学生数据
loadStudentData('');
