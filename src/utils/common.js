import moment from 'moment';
import toastr from 'toastr'
import {EMPID_ERROR, PROJECTID_ERROR, DATEFROM_ERROR, DATETO_ERROR} from '../constants/notifications';

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

    if (!longestCollaboration.totalDays) {
        toastr.error('There are no pairs of employees who have worked on the same project');
    }
    return longestCollaboration;
};

const getDate = (date) => moment(date === "NULL" ? new Date() : date.replace(/\./g, ' '));

export const validateProjectData = (project) => {
    if (!project.hasOwnProperty("EmpID") || typeof project.EmpID !== "number") {
        toastr.error(EMPID_ERROR);
        return EMPID_ERROR;
    }

    if (!project.hasOwnProperty("ProjectID") || typeof project.ProjectID !== "number") {
        toastr.error(PROJECTID_ERROR);
        return PROJECTID_ERROR;
    }

    if (!project.hasOwnProperty("DateFrom") || !(new Date(project.DateFrom) instanceof Date)) {
        toastr.error(DATEFROM_ERROR);
        return DATEFROM_ERROR;
    }

    if (!project.hasOwnProperty("DateTo") || (project.DateTo !== "NULL" && !(new Date(project.DateTo) instanceof Date))) {
        toastr.error(DATETO_ERROR);
        return DATETO_ERROR;
    }
};

export const extractLongestCommonProject = (projects) => {
    const collaborations = {};
    let error = '';

    // Filter only valid project entries
    for (let project of projects.filter(p => p.EmpID)) {
        //Trim all incoming keys in case of unwated spaces from CSV file
        Object.keys(project).forEach(k => project[k.trim()] = project[k]);
        error = validateProjectData(project);
        if (error) return;

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
    };

    return getLongestCollaboration(collaborations);
}
