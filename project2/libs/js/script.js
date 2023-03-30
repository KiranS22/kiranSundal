const populateEmployereData = (data) => {
  let content = "";
  for (let i = 0; i < data.length; i++) {
    const employee = data[i];
    // console.log("Employee", employee);
    if (!employee.id) {
      console.log(` employee number${i}`, employee);
    }
    // console.log("Employee id in loop", employee.id);
    content += `<tr>`;
    content += `<td class="listItem" id="${employee.id}"> ${employee.firstName} ${employee.lastName}</td>`;
    content += `<td>${employee.department}</td>`;
    content += `<td><button class="btn btn-dark edit-btn btn-sm" id="${employee.id}">Edit</button> <button class=" btn btn-danger btn-sm">Delete</button></td>`;
    content += `</tr>`;
  }
  $("#employeesList").html(content);
};
const getAllEmployeeInfo = () => {
  $.ajax({
    type: "GET",
    url: "libs/php/getAll.php",
    data: "data",
    dataType: "json",
    success: (response) => {
      populateEmployereData(response.data);
    },
    error: (jqXHR, textStatus, errorThrown) => {
      console.log("Error", errorThrown, jqXHR);
    },
  });
};

const getEmployeeById = (id, modalType) => {
  console.log(modalType, id);
  $.ajax({
    type: "GET",
    url: "libs/php/getPersonnelByID.php",
    data: { id: Number(id) },
    dataType: "json",
    success: (response) => {
      if (response.status.name === "ok") {
        let person = response.data.personnel;

        if (person.length > 0) {
          console.log("person", person);
          person = person[0];
          if (modalType === "edit") {
            $("#edit-lastName").val(person.lastName);
            $("#edit-firstName").val(person.firstName);
            $("#edit-email").val(person.email);
            $("#edit-jobTitle").val(person.jobTitle);
            $("#edit-id").val(person.id);
            $("#edit-Department").val(person.departmentID);
          } else {
            $("#lastName").val(person.lastName);
            $("#firstName").val(person.firstName);
            $("#email").val(person.email);
            $("#jobTitle").val(person.jobTitle);
          }
        } else {
          alert("Person not found");
        }
      }
    },
    error: (jqXHR, textStatus, errorThrown) => {
      console.log("Error", errorThrown, jqXHR);
    },
  });
};
const createEmployee = () => {
  $.ajax({
    type: "POST",
    url: "url",
    data: "data",
    dataType: "json",
    success: (response) => {},
    error: (jqXHR, textStatus, errorThrown) => {
      console.log("Error", errorThrown, jqXHR);
    },
  });
};
const updateEmployeeInformation = (
  firstName,
  lastName,
  jobTitle,
  email,
  departmentID,
  id
) => {
  console.log(
    "fn",
    firstName,
    "lm",
    lastName,
    "jt",
    jobTitle,
    "mail",
    email,
    "did",
    departmentID,
    "id",
    id
  );
  $.ajax({
    type: "POST",
    url: "libs/php/updatePersonnel.php",
    data: { firstName, lastName, jobTitle, email, departmentID, id },
    dataType: "json",
    success: (response) => {
      console.log("updated employee", response);
    },
    error: (jqXHR, textStatus, errorThrown) => {
      console.log("Error", errorThrown, jqXHR);
    },
  });
};
const deleteAnEmployeeById = () => {
  $.ajax({
    type: "DELETE",
    url: "url",
    data: "data",
    dataType: "json",
    success: (response) => {},
    error: (jqXHR, textStatus, errorThrown) => {
      console.log("Error", errorThrown, jqXHR);
    },
  });
};

const getAllDepartments = () => {
  $.ajax({
    type: "GET",
    url: "url",
    data: "data",
    dataType: "dataType",
    success: (response) => {},
    error: (jqXHR, textStatus, errorThrown) => {
      console.log("Error", errorThrown, jqXHR);
    },
  });

  const CreateDepartment = () => {
    $.ajax({
      type: "POST",
      url: "url",
      data: "data",
      dataType: "json",
      success: (response) => {},
      error: (jqXHR, textStatus, errorThrown) => {
        console.log("Error", errorThrown, jqXHR);
      },
    });
  };
};
const getDepartmentById = () => {
  $.ajax({
    type: "GET",
    url: "url",
    data: "data",
    dataType: "json",
    success: (response) => {},
    error: (jqXHR, textStatus, errorThrown) => {
      console.log("Error", errorThrown, jqXHR);
    },
  });
};
const deleteDepartmentsById = () => {
  $.ajax({
    type: "DELETE",
    url: "url",
    data: "data",
    dataType: "dataType",
    success: (response) => {},
    error: (jqXHR, textStatus, errorThrown) => {
      console.log("Error", errorThrown, jqXHR);
    },
  });
};

$(document).ready(() => {
  console.log("Query Working");
  getAllEmployeeInfo();

  $(document).on("click", ".edit-btn", (e) => {
    console.log("edit Running", e.target);
    let editId = e.target.getAttribute("id");
    console.log("edit id", editId);
    getEmployeeById(editId, "edit");
    $("#editForm").modal("show");
  });

  $(document).on("click", ".listItem", (e) => {
    console.log("Clicked");
    let personId = e.target.getAttribute("id");
    getEmployeeById(personId, "read");
    $("#readOnlyForm").modal("show");
  });
  $("#editForm").on("submit", (e) => {
    console.log("submit running");
    e.preventDefault();
    updateEmployeeInformation(
      $("#edit-firstName").val(),
      $("#edit-lastName").val(),
      $("#edit-jobTitle").val(),
      $("#edit-email").val(),
      $("#edit-Department").val(),
      $("#edit-id").val()
    );
    // close modal
    // readload page
  });
});
