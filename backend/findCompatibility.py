def calculate_compatibility(job_skills, user_skills):
    # Convert both lists to uppercase before creating sets
    job_skills_upper = [skill.upper() for skill in job_skills]
    user_skills_upper = [skill.upper() for skill in user_skills]
    
    # Convert both lists to sets for easier comparison
    job_skills_set = set(job_skills_upper)
    user_skills_set = set(user_skills_upper)
   
    # Calculate matching skills
    matching_skills = job_skills_set.intersection(user_skills_set)
    num_matching = len(matching_skills)
   
    # Calculate compatibility percentage
    if len(job_skills_set) == 0:
        compatibility_percentage = 0  # Avoid division by zero
    else:
        compatibility_percentage = (num_matching / len(job_skills_set)) * 100
   
    return compatibility_percentage, matching_skills