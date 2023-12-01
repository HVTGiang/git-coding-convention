// 'use strict'

const getElementById = (id) => document.getElementById(id);
const createElement = (tagName) => document.createElement(tagName);
const tableBodyElement = getElementById('tbody');
const inputElement = document.createElement('input');

// Tạo một biến global tên là petList là một mảng lưu danh sách thú cưng.
const petList = [];

// Object chứa thuộc tính Id của các input
const inputElementsId = { id: 'input-id',
  name: 'input-name',
  age: 'input-age',
  type: 'input-type',
  weight: 'input-weight',
  length: 'input-length',
  breed: 'input-breed',
  color: 'input-color',
  vaccinated: 'input-vaccinated',
  dewormed: 'input-dewormed',
  sterilized: 'input-sterilized',
}

// DOM của các button
const healthyButtonElement = getElementById('healthy-btn')
const showAllButtonElement = getElementById('show-all-btn')
const calculateBMIButtonElement = getElementById('calculate-BMI-btn')
let isShowingHealthyPets = false;

// Gán sự kiện click cho các button
healthyButtonElement.onclick = showHealthyPets;
showAllButtonElement.onclick = showAllPets;
calculateBMIButtonElement.onclick = calculateBMI;

// 8. Hiển thị các thú cưng khỏe mạnh
function showHealthyPets() {
  if (!petList.length) {
    alert('there was no pet added!');
    return;
  }
  // Tìm các pets không đạt chỉ  tiêu
  const unhealthyPets = petList.filter(pet => !pet.vaccinated || !pet.dewormed || !pet.sterilized);
  // Ẩn các pets không đạt chỉ tiêu
  unhealthyPets.forEach(pet => {
    const row = tableBodyElement.querySelector(`[id="${pet.id}"]`);
    row.style.display = 'none';
  });
  healthyButtonElement.style.display = 'none';
  showAllButtonElement.style.display = 'inline-block'
  isShowingHealthyPets = true;
}

// Hiện tất cả các pets
function showAllPets() {
  if (!petList.length) {
    alert('there was no pet added!');
    return;
  }
  tableBodyElement.querySelectorAll('tr').forEach(row => row.style.display = 'table-row');
  showAllButtonElement.style.display = 'none';
  healthyButtonElement.style.display = 'inline-block';
}

const dogBMI = 703;
const catBMI = 886;

// 9. (Nâng cao) Tính toán chỉ số BMI
function calculateBMI() {
  if (petList.every(pet => pet.bmi)) {
    alert('All BMI was calculated!');
    return;
  }
  petList.forEach(pet => {
    // Tìm các thẻ td có id = ("bmi-" + "id của pet"), sau đó tính toán và gán giá trị vào thẻ td
      const tableDataElement=tableBodyElement.querySelector(`[id="bmi-${pet.id}"]`);
      let bodyMassIndex=0;
    if (pet.type==='Dog') {
      bodyMassIndex=dogBMI;
    } else {
      bodyMassIndex=catBMI;
    }
    pet.bmi=((pet.weight * bodyMassIndex) / pet.length ** 2).toFixed(2)
    tableDataElement.innerHTML =pet.bmi;
  });
}

// Tạo các dòng cho table
function renderRow(pet) {
    const tableRowElement = createElement('tr');
    tableRowElement.id = pet.id;

    let tableData = '';
  Object.entries(inputElementsId).forEach(([inputFieldName, inputId]) => {
    // Với mỗi giá trị inputId của input lấy từ object inputElementsId, get DOM của input
    const inputElement = getElementById(inputId);
    const petValue = pet[inputFieldName];
    if (inputElement.type === 'checkbox') {
      // Nếu là loại input checkbox
      tableData +=
        `
          <td>
            <i class="bi bi-${petValue ? 'check' : 'x'}-circle-fill"></i>
          </td>
        `;
    } else if (inputElement.type === 'color') {
      // Nếu là loại input color
      tableData +=
        `
          <td>
            <i class="bi bi-square-fill" style="color: ${petValue} "></i>
          </td>
        `;
    } else {
      // Thêm đơn vị cho các giá trị như chiều cao, cân nặng
      let unit = '';
      if (inputId === inputElementsId.weight) {
        unit = 'kg';
      } else if (inputId === inputElementsId.length) {
        unit = 'cm';
      } else {
        unit = '';
      }
      tableData +=
        `
          <td>
            ${inputId === inputElementsId.id ? `<b>${petValue}</b>` : `${petValue} ${unit}`}
          </td>
        `;
    }
  });
  tableData +=
    `
      <td id="bmi-${pet.id}">
        ?
      </td>
    `;
    const timeElapsed = Date.now();
    const currentDate = new Date(timeElapsed);
  tableData +=
    `
      <td>
        ${currentDate.toLocaleDateString()}
      </td>
    `;
    const buttonElement = createElement('button');
    buttonElement.innerHTML = 'Delete';
    buttonElement.className = 'btn btn-danger';
    buttonElement.type = 'button';

  // Xóa dòng
  function removeRow(petId) {
    const petRowElement = tableBodyElement.querySelector(`[id="${petId}"]`);
    petRowElement.remove();
  }
  // 7. Xóa một thú cưng
  function deletePet(petId) {
    const isConfirm = confirm('Are you sure you want to delete this pet?');
    if (!isConfirm) return;
    const index = petList.findIndex(p => p.id === petId);
    petList.splice(index, 1);
    removeRow(petId);
  }

  // Gán hàm xóa dòng cho sự kiện click của nút xóa
    buttonElement.onclick = () => { deletePet(pet.id); };
    const tableDataElement = createElement('td');
    tableDataElement.appendChild(buttonElement);
    tableRowElement.innerHTML = tableData;
    tableRowElement.appendChild(tableDataElement);
    tableBodyElement.appendChild(tableRowElement)
}

// 1. Bắt sự kiện Click vào nút "Submit"
function onSubmit() {
  // 3. Validate dữ liệu hợp lệ
  const checkIsInfoValid = () => {
    const idInputElementValue = getElementById(inputElementsId.id).value;
    if (!idInputElementValue && idInputElementValue !== 0) {
      alert('Enter ID!');
      return;
    }
    if (petList.some(pet => pet.id === idInputElementValue)) {
      alert('ID must be unique!');
      return;
    }
    const nameInputElementValue = getElementById(inputElementsId.name).value;
    if (!nameInputElementValue && nameInputElementValue !== 0) {
      alert('Enter name!');
      return;
    }
    const ageInputElementValue = getElementById(inputElementsId.age).value;
    if (!ageInputElementValue && ageInputElementValue !== 0) {
      alert('Enter age!');
      return;
    }
    if (ageInputElementValue < 1 || ageInputElementValue > 15) {
      alert('Age must be between 1 and 15!');
      return;
    }
    const weightInputElementValue = getElementById(inputElementsId.weight).value;
    if (!weightInputElementValue && weightInputElementValue !== 0) {
      alert('Enter weight!');
      return;
    }
    if (weightInputElementValue < 1 || weightInputElementValue > 15) {
      alert('Weight must be between 1 and 15!');
      return;
    }
    const lengthInputElementValue = getElementById(inputElementsId.length).value;
    if (!lengthInputElementValue && lengthInputElementValue !== 0) {
      alert('Enter length!');
      return;
    }
    if (lengthInputElementValue < 1 || lengthInputElementValue > 100) {
      alert('Length must be between 1 and 100!');
      return;
    }
    if (!getElementById(inputElementsId.type).value) {
      alert('Please select Type!');
      return;
    }
    if (!getElementById(inputElementsId.breed).value) {
      alert('Please select Breed!');
      return;
    }
    return true;
  };
  if (!checkIsInfoValid()) return;

  // 2. Lấy được dữ liệu từ các Input Form
  const pet = {};
  Object.entries(inputElementsId).forEach(([key, inputElementId]) => {
    const inputElement = getElementById(inputElementId);
    pet[key] = inputElement.type === 'checkbox' ? inputElement.checked : inputElement.value;
  });
  if (pet.vaccinated && pet.dewormed && pet.sterilized) pet.isHealthy = true;
  // 4. Thêm thú cưng vào danh sách
  petList.push(pet);
  // 5. Hiển thị danh sách thú cưng
  renderRow(pet);

  function resetForm() {
    Object.values(inputElementsId).forEach(val => {
      getElementById(val).value = '';
      getElementById(val).checked = false;
    });
  }
  // 6. Xóa các dữ liệu vừa nhập trên Form
  resetForm();

  showAllPets();

}

const breeds = [{ name: 'Tabby', type: 'Dog' }, { name: 'Mixed Breed', type: 'Dog' }, { name: 'MiMi', type: 'Cat' }, { name: 'Tom', type: 'Cat' }];
// Khi chọn type (Dog hoặc Cat) thì sẽ hiển thị danh sách giống tương ứng với type
function renderListPetBreeds() {
  const typeInputElement = getElementById(inputElementsId.type);
  let breedInnerHTML =
    `
      <option value="">-- Select breed --</option>
    `;

  if (typeInputElement.value === 'Dog') {
    // nếu type là Dog thì chỉ hiện thị các giống thuộc type là Dog
    breeds.filter(b => b.type === 'Dog').forEach(b => {
      breedInnerHTML +=
        `
          <option value="${b.name}">${b.name}</option>
        `;
    });

  } else if (typeInputElement.value === 'Cat') {
    // nếu type là Cat thì chỉ hiện thị các giống thuộc type là Cat
    breeds.filter(b => b.type === 'Cat').forEach(b => {
      breedInnerHTML +=
        `
          <option value="${b.name}">${b.name}</option>
        `;
    });
  } else {
    breeds.forEach(b => {
      breedInnerHTML +=
        `
          <option value="${b.name}">${b.name}</option>
        `;
    });
  }
  const breedInputElement = getElementById(inputElementsId.breed);
  breedInputElement.innerHTML = breedInnerHTML;
}

function toggleSideBar() {
  document.getElementById('sidebar').classList.toggle('active');
}
