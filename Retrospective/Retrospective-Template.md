TEMPLATE FOR RETROSPECTIVE (Team 6)
=====================================

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES 

### Macro statistics

- Number of stories committed vs. done `3 vs. 2`
- Total points committed vs. done `13 vs. 8`
- Nr of hours planned vs. spent (as a team) `94h 13m vs. 88h 30m`

**Remember**a story is done ONLY if it fits the Definition of Done:
 
- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed

> Please refine your DoD if required (you cannot remove items!) 

### Detailed statistics

| Story  | # Tasks | Points | Hours est. | Hours actual |
|--------|---------|--------|------------|--------------|
| _#0_   |    10    |       |     4d 4h       |      4d 5h 30m        |
| _#1_   |    15     |   3    |    2d 5h       |       2d 5h 45m       |
| _#2_   |    12     |   5    |    3d 43m       |       3d 30m       |
| _#3_   |     7    |    5   |      1d 4h 30m     |       1d 3h 45m       |
   

> story `#0` is for technical tasks, leave out story points (not applicable in this case)

- Hours per task average, standard deviation (estimate and actual)
  - estimate: `average: 2.21 hours` `standard deviation: 0.84 hours`
  - actual: `average: 2.23 hours` `standard deviation: 0.90 hours`
- Total estimation error ratio: sum of total hours spent / sum of total hours effort - 1

    $$\frac{\sum_i spent_{task_i}}{\sum_i estimation_{task_i}} - 1 = 0.014 $$
    
- Absolute relative task estimation error: sum( abs( spent-task-i / estimation-task-i - 1))/n

    $$\frac{1}{n}\sum_i^n \left| \frac{spent_{task_i}}{estimation_task_i}-1 \right| = 0.037 $$
  
## QUALITY MEASURES 

- Unit Testing:
  - Total hours estimated: `12h`
  - Total hours spent: `8h 30m`
  - Nr of automated unit test cases: `49 tests`
  - Coverage (if available)
- E2E testing:
  - Total hours estimated: `2h`
  - Total hours spent: `2h 10m`
- Code review 
  - Total hours estimated: `none`
  - Total hours spent: `none`
  


## ASSESSMENT

1. **What caused your errors in estimation? (if any)**
   - We didn’t have all tasks clearly defined during sprint planning. This was partly because we didn’t know the full team size at the start, one person joined late, and another had to leave. Also, we weren’t sure if testing should be done as separate tasks or included in longer tasks in their verification part.
   - Our lack of experience with Agile made it hard to estimate some tasks accurately, underestimating how long they would take (but only for a small percentage of tasks). We aimed for 2-hour tasks but forgot to consider possible issues, like learning new libraries or needing extra resources.
   - We included part of a feature that wasn’t meant for this sprint, which was actually part of a lower-priority story. This mistake cost extra time and effort, showing us the importance of sticking to our plan.

2. **What lessons did you learn (both positive and negative) in this sprint**
   - We learned how important it is to fully define all the work at the beginning of the sprint.
   - We also saw the need to prioritize tasks. Some team members, that have already finished their main tasks, worked on less important tasks while others struggled to complete the main ones. If we had prioritized better, we could have focused on major tasks first and had time left for any last-minute issues.

3. **Which improvement goals set in the previous retrospective were you able to achieve?**
   - This is our first retrospective, so we didn’t have any previous goals to review.

4. **Which ones you were not able to achieve? Why?**
   - Since this is the first retrospective, we don’t have any previous goals that we missed.

5. **Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)**
   - *Goal 1:* We want to avoid any confusion about which stories to implement and which not to implement. To achieve this, we’ll spend more time reviewing all stories together at the start, making sure each team member fully understands the scope.
   - *Goal 2:* We’ll spend more time on sprint planning to define tasks better. This will help us stay focused and avoid confusion about what to work on.
   - *Goal 3:* We want to test the code more completely and at different levels. This means we’ll need to better estimate the amount of work needed for testing, so we can make sure it fits into our sprint planning.
   - *Goal 4:* We need to focus on the priority of the features to implement. This means consistently identifying and working on the most important features first, to ensure they are completed early and reduce the risk of missing key functionality.

6. **One thing you are proud of as a team!**
   - Clear roles and responsibilities! Thanks to which our team worked very well together. Also, the stakeholders and product owner really liked the interface we designed, which shows the hard work and dedication of everyone involved.
