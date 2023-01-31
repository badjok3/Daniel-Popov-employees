import moment from 'moment';

let error = '';

const getLongestCollaboration = (collaborations) => {
    let longestCollaboration = {
        totalDays: 0
    };

    for (const collaborationKey in collaborations) {
        const collaboration = collaborations[collaborationKey];

        if (collaboration.totalDays > longestCollaboration.totalDays) {
            longestCollaboration = collaboration;
        }
    };

    return longestCollaboration;
};

const getDate = (date) => moment(date === "NULL" ? new Date() : date.replace(/\./g, ' '));

export const validateProjectData = (project) => {
    if (!project.hasOwnProperty("EmpID") || typeof project.EmpID !== "number") {
        error = "Each project must have a numeric EmpID property.";
    }

    if (!project.hasOwnProperty("ProjectID") || typeof project.ProjectID !== "number") {
        error = "Each project must have a numeric ProjectID property.";
    }

    if (!project.hasOwnProperty("DateFrom") || !(new Date(project.DateFrom) instanceof Date)) {
        error = "Each project must have a valid DateFrom property in a valid format.";
    }

    if (!project.hasOwnProperty("DateTo") || (project.DateTo !== "NULL" && !(new Date(project.DateTo) instanceof Date))) {
        error = "Each project must have a valid DateTo property in a valid format 'YYYY-MM-DD' or the value 'NULL'.";
    }
};

export const extractLongestCommonProject = (projects) => {
    const collaborations = {};
    error = '';

    // Filter only valid project entries
    projects.filter(p => p.EmpID).forEach(project => {
        //Trim all incoming keys in case of unwated spaces from CSV file
        Object.keys(project).forEach(k => project[k.trim()] = project[k]);
        validateProjectData(project);
        if (error.length) return

        const employee = project.EmpID,
            projectId = project.ProjectID,
            startDate = getDate(project.DateFrom),
            endDate = getDate(project.DateTo);

        // Filter only valid project entries
        projects.filter(p => p.EmpID).forEach(secondProject => {
            if (!secondProject.EmpID || secondProject.EmpID === employee) return;
            //Trim all incoming keys in case of unwated spaces from CSV file
            Object.keys(secondProject).forEach(k => secondProject[k.trim()] = secondProject[k]);

            const secondEmployee = secondProject.EmpID,
                secondProjectId = secondProject.ProjectID,
                secondStartDate = getDate(secondProject.DateFrom),
                secondEndDate = getDate(secondProject.DateTo),
                earliestEnd = endDate < secondEndDate ? endDate : secondEndDate,
                latestStart = startDate > secondStartDate ? startDate : secondStartDate,
                daysDiff = Math.abs(latestStart.diff(earliestEnd, 'days')),
                // Use a distinct collaboration key to aviod duplication, due to project overlap
                collaborationKey = [employee, secondEmployee].sort().join(', ');

            if (projectId === secondProjectId
                && latestStart < earliestEnd) {
                if (!collaborations[collaborationKey]) {
                    collaborations[collaborationKey] = {
                        totalDays: 0,
                        pairs: []
                    };
                }
                // Avoid publishing duplicate data
                if (collaborations[collaborationKey].pairs.some(p => p.employeePair === collaborationKey && p.projectId === projectId)) return;
                collaborations[collaborationKey].pairs.push({
                    employeePair: collaborationKey,
                    days: daysDiff,
                    projectId: projectId
                });
                collaborations[collaborationKey].totalDays += daysDiff;
            }
        });
    });

    return error.length ? { error } : getLongestCollaboration(collaborations);
}
