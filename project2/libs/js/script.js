$(document).ready(() => {
  console.log("Query Working");

  const getAllEmployeeInfo = () => {
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
  const getEmployeeById = () => {
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
  const updateEmployeeInformation = () => {
    $.ajax({
      type: "PUT",
      url: "url",
      data: "data",
      dataType: "json",
      success: (response) => {},
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
  const popuklateReadOnlyForm = () => {
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
});
