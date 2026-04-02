<<<<<<< HEAD
#include <stdio.h>

int main() {
    int w, c;

    // Input number of warehouses and customers
    printf("Enter number of warehouses: ");
    scanf("%d", &w);

    printf("Enter number of customers: ");
    scanf("%d", &c);

    int supply[w], demand[c];
    int cost[w][c];
    int allocation[w][c];

    // Initialize allocation
    for (int i = 0; i < w; i++) {
        for (int j = 0; j < c; j++) {
            allocation[i][j] = 0;
        }
    }

    // Input supply
    printf("\nEnter supply for each warehouse:\n");
    for (int i = 0; i < w; i++) {
        printf("W%d: ", i + 1);
        scanf("%d", &supply[i]);
    }

    // Input demand
    printf("\nEnter demand for each customer:\n");
    for (int j = 0; j < c; j++) {
        printf("C%d: ", j + 1);
        scanf("%d", &demand[j]);
    }

    // Input cost matrix
    printf("\nEnter cost matrix:\n");
    for (int i = 0; i < w; i++) {
        for (int j = 0; j < c; j++) {
            printf("Cost W%d -> C%d: ", i + 1, j + 1);
            scanf("%d", &cost[i][j]);
        }
    }

    int totalCost = 0;

    // Greedy + Minimum Cost Allocation
    for (int i = 0; i < w; i++) {
        for (int j = 0; j < c; j++) {

            if (supply[i] > 0 && demand[j] > 0) {

                int min = (supply[i] < demand[j]) ? supply[i] : demand[j];

                allocation[i][j] = min;

                supply[i] -= min;
                demand[j] -= min;

                totalCost += min * cost[i][j];
            }
        }
    }

    // Output allocation
    printf("\nOptimal Allocation:\n");
    for (int i = 0; i < w; i++) {
        for (int j = 0; j < c; j++) {
            if (allocation[i][j] > 0) {
                printf("W%d -> C%d : %d units\n", i + 1, j + 1, allocation[i][j]);
            }
        }
    }

    printf("\nTotal Transportation Cost = %d\n", totalCost);

    return 0;
=======
#include <stdio.h>

int main() {
    int w, c;

    // Input number of warehouses and customers
    printf("Enter number of warehouses: ");
    scanf("%d", &w);

    printf("Enter number of customers: ");
    scanf("%d", &c);

    int supply[w], demand[c];
    int cost[w][c];
    int allocation[w][c];

    // Initialize allocation
    for (int i = 0; i < w; i++) {
        for (int j = 0; j < c; j++) {
            allocation[i][j] = 0;
        }
    }

    // Input supply
    printf("\nEnter supply for each warehouse:\n");
    for (int i = 0; i < w; i++) {
        printf("W%d: ", i + 1);
        scanf("%d", &supply[i]);
    }

    // Input demand
    printf("\nEnter demand for each customer:\n");
    for (int j = 0; j < c; j++) {
        printf("C%d: ", j + 1);
        scanf("%d", &demand[j]);
    }

    // Input cost matrix
    printf("\nEnter cost matrix:\n");
    for (int i = 0; i < w; i++) {
        for (int j = 0; j < c; j++) {
            printf("Cost W%d -> C%d: ", i + 1, j + 1);
            scanf("%d", &cost[i][j]);
        }
    }

    int totalCost = 0;

    // Greedy + Minimum Cost Allocation
    for (int i = 0; i < w; i++) {
        for (int j = 0; j < c; j++) {

            if (supply[i] > 0 && demand[j] > 0) {

                int min = (supply[i] < demand[j]) ? supply[i] : demand[j];

                allocation[i][j] = min;

                supply[i] -= min;
                demand[j] -= min;

                totalCost += min * cost[i][j];
            }
        }
    }

    // Output allocation
    printf("\nOptimal Allocation:\n");
    for (int i = 0; i < w; i++) {
        for (int j = 0; j < c; j++) {
            if (allocation[i][j] > 0) {
                printf("W%d -> C%d : %d units\n", i + 1, j + 1, allocation[i][j]);
            }
        }
    }

    printf("\nTotal Transportation Cost = %d\n", totalCost);

    return 0;
>>>>>>> 3719c99 (frontend deploy)
}